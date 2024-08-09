package codex.grapsee;


import android.Manifest;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import codex.grapsee.utilities.Utilities;


public class MainActivity extends Activity {
    public static final String URL = "https://grapsee.com";
    private ValueCallback<Uri[]> mUploadMessage;
    private static final int FILE_CHOOSER_RESULT_CODE = 1;
    private static final int REQUEST_FILE_UPLOAD_PERMISSION = 1;

    private SwipeRefreshLayout swipeRefreshLayout;

    public static boolean isSupperBack = false;
    private ProgressBar progressBar;
    @SuppressLint("StaticFieldLeak")
    public static WebView webview;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Utilities.init(this);

        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);

        webview = findViewById(R.id.custom_webview);
        progressBar = findViewById(R.id.progress_bar);

        WebSettings webSettings = webview.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportMultipleWindows(true);
        webSettings.setLoadsImagesAutomatically(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setDomStorageEnabled(true);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webview, true);

        webview.setWebViewClient(new MyWebViewClient());
        webview.setWebChromeClient(new MyWebChromeClient());
        webview.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> askForPermissionAndDownload(url, contentDisposition, mimetype));

        webview.addJavascriptInterface(new Utilities(), "App");

        webview.loadUrl(URL);

        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                webview.reload();
            }
        });
    }

    @SuppressLint("MissingSuperCall")
    @Override
    public void onBackPressed() {
        if(isSupperBack){
            if(webview.canGoBack()) {
                webview.goBack();
            } else {
                showExitDialog();
            }
            isSupperBack = false;
            return;
        }
        runJS("try{ window.onBackPressed(); } catch (e) { window.App.onBackPressed(); }");
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (Utilities.isInternetAvailable()){
            Utilities.showNoInternetDialog();
            return;
        }
        if(webview != null) {
            webview.onResume();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if(webview != null) {
            webview.onPause();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_RESULT_CODE) {
            if (resultCode == RESULT_OK && mUploadMessage != null) {
                Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                mUploadMessage.onReceiveValue(result);
                mUploadMessage = null;
            } else if (resultCode == RESULT_CANCELED && mUploadMessage != null) {
                mUploadMessage.onReceiveValue(null);
                mUploadMessage = null;
            }
        }
    }


    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webview.saveState(outState);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        webview.restoreState(savedInstanceState);
    }

    public static void runJS(String js){
        if(webview != null)
            webview.evaluateJavascript("try{" + js + "}catch(e){}",null);
    }

    private class MyWebViewClient extends WebViewClient {
        MyWebViewClient(){}

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            swipeRefreshLayout.setRefreshing(true);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            progressBar.setVisibility(ProgressBar.GONE);
            swipeRefreshLayout.setRefreshing(false);
            if (Utilities.isInternetAvailable()){
                Utilities.showNoInternetDialog();
                return;
            }
            Utilities.startApp();
        }

    }


    @SuppressLint("NewApi")
    private boolean checkPermission() {
        return checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }


    @SuppressLint("NewApi")
    private void requestPermission() {
        requestPermissions( new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, REQUEST_FILE_UPLOAD_PERMISSION);
    }

    private class MyWebChromeClient extends WebChromeClient {
        private View mCustomView;
        private CustomViewCallback mCustomViewCallback;
        private int mOriginalSystemUiVisibility;
        private final Handler handler = new Handler();
        private static final long interval = 3000;

        private final Runnable runnableCode = new Runnable() {
            @Override
            public void run() {
                getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
                handler.postDelayed(this, interval);
            }
        };

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            progressBar.setProgress(newProgress);
            if (newProgress == 100) {
                progressBar.setVisibility(ProgressBar.GONE);
                swipeRefreshLayout.setRefreshing(false);
            } else {
                progressBar.setVisibility(ProgressBar.VISIBLE);
                swipeRefreshLayout.setRefreshing(true);
            }
        }

        @SuppressLint("SourceLockedOrientationActivity")
        public void onHideCustomView() {
            handler.removeCallbacks(runnableCode);
            ((FrameLayout) getWindow().getDecorView()).removeView(this.mCustomView);
            this.mCustomView = null;
            this.mCustomViewCallback.onCustomViewHidden();
            this.mCustomViewCallback = null;
            getWindow().getDecorView().setSystemUiVisibility(this.mOriginalSystemUiVisibility);
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }

        public void onShowCustomView(View paramView, CustomViewCallback paramCustomViewCallback)
        {
            if (this.mCustomView != null) {
                onHideCustomView();
                return;
            }

            this.mCustomView = paramView;
            this.mOriginalSystemUiVisibility = getWindow().getDecorView().getSystemUiVisibility();
            this.mCustomViewCallback = paramCustomViewCallback;
            ((FrameLayout) getWindow().getDecorView()).addView(this.mCustomView, new FrameLayout.LayoutParams(-1, -1));


            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);

            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

            handler.post(runnableCode);
        }


        @Override
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
            if (checkPermission()) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                    mUploadMessage = null;
                }
                mUploadMessage = filePathCallback;
                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILE_CHOOSER_RESULT_CODE);
                } catch (ActivityNotFoundException e) {
                    mUploadMessage = null;
                    Utilities.showToast("Cannot open file chooser");
                    return false;
                }
            } else {
                requestPermission();
            }
            return true;
        }

    }



    @TargetApi(Build.VERSION_CODES.M)
    private void askForPermissionAndDownload(String url, String contentDisposition, String mimetype) {
        if (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 100);
        } else {
            String fileName = URLUtil.guessFileName(url, contentDisposition, mimetype);
            String downloadDirectory = Environment.DIRECTORY_DOWNLOADS;

            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setMimeType(mimetype);
            request.setTitle(fileName);
            request.setDescription("Downloading...");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(downloadDirectory, fileName);

            DownloadManager downloadManager = (DownloadManager) this.getSystemService(Context.DOWNLOAD_SERVICE);

            if (downloadManager != null) {
                downloadManager.enqueue(request);
            }

            Utilities.showToast("Please wait, downloading...");
        }
    }

    private void showExitDialog(){
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getResources().getString(R.string.exit_dialog_title));
        builder.setMessage(getResources().getString(R.string.exit_dialog_descriptions));
        builder.setPositiveButton(getResources().getString(R.string.yes_btn), (dialog, which) -> finish());
        builder.setNegativeButton(getResources().getString(R.string.no_btn), (dialog, which) -> dialog.dismiss());
        AlertDialog dialog = builder.create();
        dialog.show();
    }
}