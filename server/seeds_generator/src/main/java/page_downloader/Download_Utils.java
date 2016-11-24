public class Download_Utils{
    public static String validate_url(String url){
	if(!url.contains("http"))
	    url = "http://" + url;
	return url;
    }
}
