import java.io.*;
import de.l3s.boilerpipe.extractors.KeepEverythingExtractor;
import de.l3s.boilerpipe.sax.BoilerpipeSAXInput;
import de.l3s.boilerpipe.sax.HTMLDocument;
import de.l3s.boilerpipe.document.TextDocument;
import de.l3s.boilerpipe.document.TextBlock;
import java.net.URL;
import java.util.*;
import java.util.HashMap;
import java.lang.String;
import java.net.URLDecoder;
import java.io.PrintWriter;

public class Extract {
    public Map process(String html)
    {
	try{
	    HashMap map = new HashMap();
	    String content = "";
	    if(!html.contains("@empty@")){
		content = KeepEverythingExtractor.INSTANCE.getText(html);
	    }
	    content = content.trim().replaceAll(" +", " ");
	    content = content.replaceAll("[\n\"\t]", " ");
	    content = content.replaceAll(",","");
	    content = content.toLowerCase();

	    map.put("content", content);

	    HTMLDocument htmlDoc = new HTMLDocument(html);
	    TextDocument doc = new BoilerpipeSAXInput(htmlDoc.toInputSource()).getTextDocument();
	    String title = doc.getTitle();
	    map.put("title", title);

	    return map;
	}
	catch(Exception e){
	    System.err.println("process Exception" + e.getMessage());
	}

	return null;
    }

    public static void main(String[] args) {
	Extract e = new Extract();

	try{
	    BufferedReader br =
		new BufferedReader(new InputStreamReader(System.in));

	    String html = "";
	    String input;

	    while((input=br.readLine())!=null){
		html += input;
	    }

	    e.process(html);

	}catch(IOException io){
	    io.printStackTrace();
	}
    }
}
