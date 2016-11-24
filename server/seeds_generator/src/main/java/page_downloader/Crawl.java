import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.InterruptedException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.client.Client;
import java.util.ArrayList;
import java.util.Map;

import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHit; 
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.MissingFilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.update.UpdateRequest;

public class Crawl {

    private ArrayList<String> urls = null;
    private String es_index = "memex";
    private String es_doc_type = "page";
    private String es_host = "localhost";
    private Client client = null;
    private int poolSize = 100;
    private ExecutorService crawlForwardService = Executors.newFixedThreadPool(poolSize);
    private ExecutorService crawlBackwardService = Executors.newFixedThreadPool(poolSize);
    private int MAXSIZE = 100000;
    
    public Crawl(String es_index, String es_doc_type, String es_host){
	if(es_host.isEmpty())
	    es_host = "localhost";
	else {
	    String[] parts = es_host.split(":");
	    if (parts.length == 2)
		es_host = parts[0];
	    else if(parts.length == 3)
		es_host = parts[1];
	    
	    es_host = es_host.replaceAll("/","");
	}

	this.es_host = es_host;

	this.client = new TransportClient().addTransportAddress(new InetSocketTransportAddress(es_host, 9300));
	
	if(!es_index.isEmpty())
	    this.es_index = es_index;
	if(!es_doc_type.isEmpty())
	    this.es_doc_type = es_doc_type;
	
    }

    public void addForwardCrawlTask(ArrayList<String> urls, String top){
	try{
	    for (String f_url : urls) {
		SearchResponse searchResponse = client.prepareSearch(this.es_index)
		    .setTypes(this.es_doc_type)
		    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
		    .setFetchSource(new String[]{"url"}, null)
		    .setQuery(QueryBuilders.termQuery("url", f_url))
		    .setSize(this.MAXSIZE)
		    .setFrom(0).setExplain(true)
		    .execute()
		    .actionGet();
		
		for (SearchHit hit : searchResponse.getHits()) {
		    UpdateRequest updateRequest = new UpdateRequest(this.es_index, this.es_doc_type, hit.getId())
			.doc(XContentFactory.jsonBuilder()
			     .startObject()
			     .field("crawled_forward", 1)
			     .endObject());
		    this.client.update(updateRequest).get();
		}
	    }

	    crawlForwardService.execute(new CrawlerInterface(urls, null, "forward", top, this.es_index, this.es_doc_type, this.es_host, this.client));
	} catch (IOException e1) {
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	} catch (InterruptedException e2) {
	    // TODO Auto-generated catch block
	    e2.printStackTrace();
	} catch (ExecutionException e3) {
	    // TODO Auto-generated catch block
	    e3.printStackTrace();
	} 
    }

    public void addBackwardCrawlTask(ArrayList<String> urls, String top){
	try{
	    MissingFilterBuilder filter=FilterBuilders.missingFilter("crawled_backward");
	    QueryBuilder qb = QueryBuilders.filteredQuery(QueryBuilders.matchAllQuery(),filter);
	    SearchResponse searchResponse = client.prepareSearch(this.es_index)
		.setTypes(this.es_doc_type)
		.setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
		.setFetchSource(new String[]{"url", "crawled_backward"}, null)
		.setQuery(qb)
		.setSize(this.MAXSIZE)
		.setFrom(0).setExplain(true)
		.execute()
		.actionGet();
	    
	    ArrayList<String> not_crawled = new ArrayList<String>();
	    for (SearchHit hit : searchResponse.getHits()) {
		Map map = hit.getSource();
		String url = (String)map.get("url");
		if(urls.contains(url)){
		    not_crawled.add(url);
		    UpdateRequest updateRequest = new UpdateRequest(this.es_index, this.es_doc_type, hit.getId())
			.doc(XContentFactory.jsonBuilder()
			     .startObject()
			     .field("crawled_backward", 1)
			     .endObject());
		    this.client.update(updateRequest).get();
		}
	    }
	    
	    crawlBackwardService.execute(new CrawlerInterface(not_crawled, null, "backward", top, this.es_index, this.es_doc_type, this.es_host, this.client));

	} catch (IOException e1) {
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	} catch (InterruptedException e2) {
	    // TODO Auto-generated catch block
	    e2.printStackTrace();
	} catch (ExecutionException e3) {
	    // TODO Auto-generated catch block
	    e3.printStackTrace();
	} 

    }

    public void shutdown(){
	try {
	    crawlForwardService.shutdown();
	    crawlBackwardService.shutdown();
	    crawlForwardService.awaitTermination(60 , TimeUnit.SECONDS);
	    crawlBackwardService.awaitTermination(60 , TimeUnit.SECONDS);
	    System.out.println("SHUTDOWN");
	    this.client.close();
	} catch (InterruptedException e) {
	    e.printStackTrace();
	}
    }

    
}
