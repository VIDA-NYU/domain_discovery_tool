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
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONString;


public class GoogleSearch {
    
    private String accountKey;
    private String cseID;
    private Properties prop; 

    public GoogleSearch(){
	try{
	    prop = new Properties();
	    FileInputStream is = new FileInputStream("conf/config.properties");
	    prop.load(is);
	    accountKey = prop.getProperty("ACCOUNTKEY_GOOG");
	    cseID = prop.getProperty("CSE_ID_GOOG");
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
	URL query_url;
	try {
	    int chunk = 10;
	    int num = 10;
	    int start = 1;
	    if (Integer.valueOf(top) < 10){
		num = Integer.valueOf(top);
		chunk = Integer.valueOf(top);
	    } 
	    while(chunk > 0){
	    	query_url = new URL("https://www.googleapis.com/customsearch/v1?start=" + String.valueOf(start) + "&num=" + String.valueOf(num) + "&key=" + accountKey + "&cx=" + cseID + "&q=" + query);  
	    	System.out.println(query_url);

	    	HttpURLConnection conn = (HttpURLConnection)query_url.openConnection();
	    	conn.setRequestMethod("GET");

	    	BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
	    	String output = "";
	    	String line;
	    	while ((line = br.readLine()) != null) {
			output = output + line;
	    	} 

	    	conn.disconnect();

		JSONObject obj=new JSONObject(output);

		JSONObject queries = (JSONObject)obj.get("queries");
		JSONArray request = (JSONArray)queries.get("request");
		Integer totalUrls = (Integer)((JSONObject)request.get(0)).get("count");
		
		JSONArray urls = (JSONArray)obj.getJSONArray("items");
		for(int i=0; i < totalUrls;++i){
		    JSONObject url = (JSONObject)urls.get(i);
		    String link = (String)url.get("link");
		    results.add(link);
		    download.addTask(link);
		}
		
		chunk = Integer.valueOf(top) - chunk;

		if (chunk < 10)
		    num = chunk;

		start = start + 10;
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
	
	GoogleSearch bs = new GoogleSearch();
	bs.search(query, top, es_index, es_doc_type, es_server);
    }
}
