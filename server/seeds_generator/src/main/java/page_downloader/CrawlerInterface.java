import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.net.URL;
import java.net.HttpURLConnection;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.StringReader;
import org.apache.commons.codec.binary.Base64;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import org.xml.sax.InputSource;
import org.w3c.dom.*;

import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.client.Client;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.index.query.MissingFilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.search.SearchHit; 
import org.elasticsearch.search.SearchHits; 

public class CrawlerInterface implements Runnable{
    private static final Pattern linkPattern = Pattern.compile("\\s*(?i)href\\s*=\\s*(\"([^\"]*\")|'[^']*'|([^'\">\\s]+))",  Pattern.CASE_INSENSITIVE|Pattern.DOTALL);
    private static final String accountKey = "jgRfXs073p8B87c/TJamrnIDjbeyYtH5gAe7+TYvsIw";
    ArrayList<String> urls = null;
    ArrayList<String> html = null;
    String es_index = "memex";
    String es_doc_type = "page";
    String es_host = "localhost";
    Client client = null;
    String crawlType = "";
    String top = "10";
    Download download = null;
    
    public CrawlerInterface(ArrayList<String> urls, ArrayList<String> html, String crawl_type, String top, String es_index, String es_doc_type, String es_host, Client client){
	this.urls = urls;
	this.html = html;
	if(!es_index.isEmpty())
	    this.es_index = es_index;
	if(!es_doc_type.isEmpty())
	    this.es_doc_type = es_doc_type;
	this.es_host = es_host;
	this.client = client;
	this.crawlType = crawl_type;
	this.top = top;
	this.download = new Download("Crawl_" + this.es_index, this.es_index, this.es_doc_type, this.es_host);
    }

    public ArrayList<String> crawl_backward(ArrayList<String> urls){
        /*Using backlink search to find more similar webpages
        *Args:
        *- urls: a list of relevant urls
        *Returns:
        *- res: a list of backlinks
        */   
        HashSet<String> links = new HashSet<String>();
        byte[] accountKeyBytes = Base64.encodeBase64((accountKey + ":" + accountKey).getBytes());
        String accountKeyEnc = new String(accountKeyBytes);
        for (String url: urls){
            try{
                String query = "inbody:" + url;
                URL urlObj = new URL("https://api.datamarket.azure.com/Data.ashx/Bing/Search/v1/Web?Query=%27" + query + "%27&$top="+ this.top);
                HttpURLConnection conn = (HttpURLConnection)urlObj.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Basic " + accountKeyEnc);

                BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
                String output = "";
                String line;
                while ((line = br.readLine()) != null) {
                    output = output + line;
                }

                conn.disconnect();

                DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
                DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder(); 
                InputSource is = new InputSource(new StringReader(output));
                Document doc = docBuilder.parse(is);
                NodeList nls = doc.getElementsByTagName("d:Url");
                
                for(int i=0; i<nls.getLength(); i++){
                    Element e = (Element)nls.item(i);
                    NodeList nl = e.getChildNodes();
                    String u = nl.item(0).getNodeValue();
                    links.add(u);
                }
            }
            catch(Exception e){
                e.printStackTrace();
            }
        }
        
        ArrayList<String> res = new ArrayList<String>(links);

	System.out.println();
	System.out.println("Backlinks");
	System.out.println(res);
	System.out.println();

	try{
	    ArrayList<String> not_crawled = new ArrayList();
	    for(String url: res){
		SearchResponse searchResponse = client.prepareSearch(this.es_index)
		    .setTypes(this.es_doc_type)
		    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
		    .setFetchSource(new String[]{"url","html","crawled_forward"}, null)
		    .setQuery(QueryBuilders.termQuery("url", url))
		    .setFrom(0).setExplain(true)
		    .execute()
		    .actionGet();
		
		SearchHit[] hits = searchResponse.getHits().getHits();
		if(hits.length > 0){
		    for (SearchHit hit : hits) {
			Map map = hit.getSource();
			if(map != null){
			    if(map.get("crawled_forward") != null){
				if((Float)map.get("crawled_forward") == 0){
				    UpdateRequest updateRequest = new UpdateRequest(this.es_index, this.es_doc_type, hit.getId())
					.doc(XContentFactory.jsonBuilder()
					     .startObject()
					     .field("crawled_forward", 1)
					     .endObject());
				    this.client.update(updateRequest).get();
				    
				    System.out.println("Crawling forward " + url);
				    System.out.println();
				    this.crawl_forward(url, (String)map.get("html"));
				}
			    }
			}
		    }
		}else {
		    not_crawled.add(url);
		}
	    }
	    
	    for(String url: not_crawled){
		// Update the crawled flag
		IndexResponse indexresponse = this.client.prepareIndex(this.es_index, this.es_doc_type)
		    .setSource(XContentFactory.jsonBuilder()
			       .startObject()
			       .field("url", url)
			       .field("crawled_forward", 1)
			       .endObject()
			       )
		    .execute()
		    .actionGet();
		
		//Download the page
		String domain = null;
		try{
		    domain = (new URL(url)).getHost();
		} catch(Exception e) {
		    e.printStackTrace();
		}
		this.download.setQuery("Crawl_" + domain);
		this.download.addTask(url);
		
		//Crawl page forward
		System.out.println("Crawling forward " + url);
		System.out.println();
		
		String html = this.getContent(url);
		this.crawl_forward(url, html);
	    }
	
	    return res;
	}
	catch(Exception e){
	    e.printStackTrace();
	}
	return null;
    }

    public ArrayList<String> crawl_forward(String url, String html){
        /*Extract and standarlize outlinks from the html
        *Args:
        *- url: 
        *- html: html content to be extracted
        *Returns:
        *- res: a list of urls extracted from html content
        */
        HashSet<String> links = new HashSet<String>();
        try{
	    int count = Integer.parseInt(this.top);
	    int num = 0;
            Matcher pageMatcher = linkPattern.matcher(html);
            String domain = "http://" + (new URL(url)).getHost();
            while(pageMatcher.find() && num <= count){
                String link = pageMatcher.group(2);
                if (link != null){
                    //Validate and standarlize url
                    link = link.replaceAll("\"", "");
                    if (link.indexOf(".css") != -1)
                        continue;
                    if (link.startsWith("/"))
                        link = domain + link;
                    if (!link.startsWith("http://"))
                        continue;
                    links.add(link);
		    num = num + 1;
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }

        ArrayList<String> res = new ArrayList<String>(links);
	for(String f_url: res){
	    String domain = this.es_index;
	    try{
		domain = (new URL(f_url)).getHost();
	    } catch(Exception e) {
		e.printStackTrace();
	    }

	    this.download.setQuery("Crawl_" + domain);
	    this.download.addTask(f_url);
	}

        return res;
    }

    public void test_backlink(String seed, String top){
        ArrayList<String> urls = new ArrayList<String>();
        urls.add(seed);
        ArrayList<String> res = crawl_backward(urls);
       
    }

    public String getContent(String seed){
        try{
            URL url = new URL(seed);
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("GET");
            
            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
            String output = "";
            String line;
            while ((line = br.readLine()) != null) {
                output = output + line;
            }
            conn.disconnect();

	    return output;

        } catch (Exception e){
            e.printStackTrace();
        }

	return "";
    }

    public void run() {
	if(this.crawlType.equals("backward")){
	    this.crawl_backward(this.urls);
	}
	else if(this.crawlType.equals("forward")){
	    for(int i=0; i < this.urls.size();++i){
		SearchResponse response = null;
		try{
		    response = client.prepareSearch(this.es_index)
			.setTypes(this.es_doc_type)
			.setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
			.setFetchSource(new String[]{"html"}, null)
			.setQuery(QueryBuilders.termQuery("url", this.urls.get(i)))                
			.setFrom(0).setExplain(true)
			.execute()
			.actionGet();
		} catch(Exception e){
		    e.printStackTrace();
		}

		if(response == null)
		    return;
		
		String html = "";
		for (SearchHit hit : response.getHits()) {
		    Map map = hit.getSource();
		    html = (String)map.get("html");
		}
		this.crawl_forward(this.urls.get(i), html);
	    }
	}
	this.download.shutdown();
    }
    
}
