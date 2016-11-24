import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.client.Client;

public class Download {

    private String query = "";
    private String es_index = "memex";
    private String es_doc_type = "page";
    private Client client = null;
    private int poolSize = 100;
    private ExecutorService downloaderService = Executors.newFixedThreadPool(poolSize);

    public Download(String query, String es_index, String es_doc_type, String es_host){
	this.query = query;
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

	this.client = new TransportClient().addTransportAddress(new InetSocketTransportAddress(es_host, 9300));
	
	if(!es_index.isEmpty())
	    this.es_index = es_index;
	if(!es_doc_type.isEmpty())
	    this.es_doc_type = es_doc_type;
    }

    public void setQuery(String query){
	this.query = query;
    }

    public void addTask(String url){
	downloaderService.execute(new Download_URL(url.trim(), this.query, this.es_index, this.es_doc_type, this.client));
    }

    public void shutdown(){
	try {
	    downloaderService.shutdown();
	    //downloaderService.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS);
	    downloaderService.awaitTermination(60 , TimeUnit.SECONDS);
	    this.client.close();
	} catch (InterruptedException e) {
	    e.printStackTrace();
	}
    }

    
}
