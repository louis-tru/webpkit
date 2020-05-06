package com.example.myapplication;

import android.net.http.SslError;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.support.v7.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

	private static String TAG = "DEMO";
	private static boolean isDev = true;
	// private static String loadUrl = "http://hacker.stars-mine.com/";
	private static String loadUrl = "https://www.baidu.com/";
	private WebView webview = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		webview = new WebView(this);
		webview.setLayoutParams(new FrameLayout.LayoutParams(
				RelativeLayout.LayoutParams.MATCH_PARENT,
				RelativeLayout.LayoutParams.MATCH_PARENT,
				Gravity.CENTER));
		webview.setLayerType(View.LAYER_TYPE_HARDWARE, null);
		setContentView(webview);

		if (isDev)
			webview.setWebContentsDebuggingEnabled(true);
			// webview.addJavascriptInterface(this, "android");

		webview.setWebViewClient(new WebViewClient() {
			@Override
			public boolean shouldOverrideUrlLoading(WebView view, String url) {
				return true;
			}
			@Override
			public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
				handler.proceed(); // 接受证书
			}
		});

		webview.setWebChromeClient(new WebChromeClient() {
			@Override
			public void onProgressChanged(WebView view, int newProgress) {
				Log.d(TAG, "loading");
			}
			@Override
			public void onPermissionRequest(PermissionRequest request) {
				String[] ss = request.getResources();
				request.grant(ss);
			}
		});


		WebSettings settings = webview.getSettings();
		settings.setJavaScriptEnabled(true);
		settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
		settings.setMediaPlaybackRequiresUserGesture(false);
		settings.setDomStorageEnabled(true);
		settings.setDatabaseEnabled(true);
		settings.setAppCacheEnabled(true);

		webview.loadUrl(loadUrl);
	}

}
