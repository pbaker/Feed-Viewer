<?php
// this is an example server-side proxy to load feeds
$feed = $_REQUEST['feed'];
if($feed != '' && strpos($feed, 'http') === 0){
	$xml = file_get_contents($feed);
	$xml = str_replace('<content:encoded>', '<content>', $xml);
	$xml = str_replace('</content:encoded>', '</content>', $xml);
	$xml = str_replace('</dc:creator>', '</author>', $xml);
	$xml = str_replace('<dc:creator', '<author', $xml);
	
	$highlight = $_REQUEST['highlight'];
	if($highlight != ''){
		// xml highlighter SOAP interface
		// key: 18d5f28a94161e3f0587342a43f584b8
		
		$service_key = "18d5f28a94161e3f0587342a43f584b8";
		$client = new SoapClient("http://tools.dottoro.com/axis2/services/codeTools?wsdl");
		
		// was 'source' => "<body>Hi!</body>"
		$request = array (
		'key' => $service_key,
		'lang' => "XML",
		'compress' => false,
		'lineNumbers' => true,
		'helpLinks' => true,
		'nofollow' => false,
		'tabSize' => 4,
		'viewPlainButton' => "View Plain",
		'copyButton' => "Copy to Clipboard",
		'printButton' => "Print",
		'source' => $xml
		);
		try {
			$response = $client->Highlight ($request);
		}
		catch (SoapFault $fault) {
			// An error occurred
			echo ("Error: " . $fault->faultstring);
			exit;
		};
			/* Ok, the source property of the response contains 
			   the source of the highlighted code */
		header('Content-Type: text/xml');
		echo ($response->source);
	} else {
	header('Content-Type: text/xml');
	echo ($xml);
	return;}
} else {
	header('Content-Type: text/xml');
	echo ('PHP Proxy Error</br>');
	echo ($feed);
	return;
}
?>