import java.util.ArrayList;
import java.util.Arrays;

public class StartCrawl {
    public static void main(String[] args) {

	String crawl = ""; //default
	String urls_str = "";
	String top = "10";
	String es_index = "memex";
	String es_doc_type = "page";
	String es_server = "localhost";
	
	int i = 0;
	while (i < args.length){
	    String arg = args[i];
	    if(arg.equals("-c")){
		crawl = args[++i];
	    } else if(arg.equals("-u")){ 
		urls_str = args[++i];
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

	ArrayList<String> urls = null;
	if(!urls_str.isEmpty()){
	    urls = new ArrayList<String>(Arrays.asList(urls_str.split(",")));
	}

	Crawl c = new Crawl(es_index, es_doc_type, es_server);

	if(urls != null && crawl.equals("forward"))
	    c.addForwardCrawlTask(urls, top);
	else if(urls != null && crawl.equals("backward"))
	    c.addBackwardCrawlTask(urls, top);

	c.shutdown();
    }
}
