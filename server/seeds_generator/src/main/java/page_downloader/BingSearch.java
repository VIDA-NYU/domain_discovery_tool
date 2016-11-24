import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.StringReader;
import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;
import java.util.ArrayList;
import org.apache.commons.codec.binary.Base64;
import org.xml.sax.InputSource;
import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;

public class BingSearch {
    
    private String accountKey;
    private Properties prop; 

    public BingSearch(){
	try{
	    prop = new Properties();
	    FileInputStream is = new FileInputStream("conf/config.properties");
	    prop.load(is);
	    accountKey = prop.getProperty("ACCOUNTKEY");
	}   
	catch(Exception e){
	    e.printStackTrace();
	    prop = null;
	}
    } 

	
    public ArrayList<String> search(String query, String top, String es_index, String es_doc_type, String es_server){
	System.out.println("Query: " + query);

	if (this.prop == null){
	    System.out.println("Error: config file is not loaded yet");
	    return null;
	}

	Download download = new Download(query, es_index, es_doc_type, es_server);
	
	ArrayList<String> results = new ArrayList<String>();
	query = query.replaceAll(" ", "%20");
	byte[] accountKeyBytes = Base64.encodeBase64((this.accountKey + ":" + this.accountKey).getBytes());
	String accountKeyEnc = new String(accountKeyBytes);
	URL query_url;
	try {
	    int chunk = 50;
	    if (Integer.valueOf(top) < 50)
		chunk = Integer.valueOf(top); 
	    int skip_index = 0;
	    while(chunk > 0){
	    	query_url = new URL("https://api.datamarket.azure.com/Data.ashx/Bing/Search/v1/Web?Adult=%27Off%27&$skip=" + String.valueOf(skip_index*50) + "&Query=%27" + query + "%20filetype:html" + "%27&$top=" + String.valueOf(chunk));
	    	System.out.println(query_url);

	    	HttpURLConnection conn = (HttpURLConnection)query_url.openConnection();
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
	    	NodeList urls = doc.getElementsByTagName("d:Url");
	    	int totalUrls = urls.getLength();

	    	for (int i=0; i<totalUrls; i++){
			Element e = (Element)urls.item(i);
			NodeList nl = e.getChildNodes();
			String url = Download_Utils.validate_url((nl.item(0).getNodeValue()));
			results.add(url);
			download.addTask(url);
	    	}
		if ((Integer.valueOf(top) - chunk) < 50) 
			chunk = Integer.valueOf(top) - chunk;
		else chunk += 50;
		++skip_index;
	    }
	} 
	catch (MalformedURLException e1) {
	    e1.printStackTrace();
	} 
	catch (IOException e) {
	    e.printStackTrace();
	}
	catch (Exception e){
	    e.printStackTrace();
	}

	download.shutdown();
	System.out.println("Number of results: " + String.valueOf(results.size()));
	return results;
    }

    public static void main(String[] args) {
	
	String query = ""; //default
	String top = "50"; //default
	String es_index = "memex";
	String es_doc_type = "page";
	String es_server = "localhost";
	
	int i = 0;
	while (i < args.length){
	    String arg = args[i];
	    if(arg.equals("-q")){
		query = args[++i];
	    } else if(arg.equals("-t")){ 
		top = args[++i];
	    } else if(arg.equals("-i")){
		es_index = args[++i];
	    } else if(arg.equals("-d")){
		es_doc_type = args[++i];
	    } else if(arg.equals("-s")){
		es_server = args[++i];
	    }else {
		System.out.println("Unrecognized option");
		break;
	    }
	    ++i;
	}
	
	System.out.println("Query = " + query);
	System.out.println("Get the top " + top + " results");
	
	BingSearch bs = new BingSearch();
	bs.search(query, top, es_index, es_doc_type, es_server);
    }
}
