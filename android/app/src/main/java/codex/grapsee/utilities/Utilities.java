package codex.grapsee.utilities;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.provider.Settings;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import codex.grapsee.MainActivity;
import codex.grapsee.R;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Utilities {
    @SuppressLint("StaticFieldLeak")
    private static Activity activity;
    private static SharedPreferences sp;

    private static boolean stopDownload;


    public static void init(Activity activity){
        Utilities.activity = activity;
        sp = activity.getSharedPreferences("prefs", Context.MODE_PRIVATE);
    }

    @JavascriptInterface
    public static void startApp() {
        final View view = activity.findViewById(R.id.splash_screen);
        view.animate()
                .translationY(0)
                .alpha(0.0f)
                .setDuration(1500)
                .setListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        super.onAnimationEnd(animation);
                        view.setVisibility(View.GONE);
                    }
                });
    }

    @JavascriptInterface
    public static void onBackPressed(){
        activity.runOnUiThread(() -> {
            MainActivity.isSupperBack = true;
            activity.onBackPressed();
        });
    }

    @JavascriptInterface
    public static void showToast(String msg){
        Toast.makeText(activity, msg, Toast.LENGTH_SHORT).show();
    }



    @JavascriptInterface
    public static boolean isInternetAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        return networkInfo == null || !networkInfo.isConnected();
    }

    public static void showNoInternetDialog() {
        MainActivity.webview.setVisibility(View.GONE);
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setCancelable(false);
        builder.setTitle(activity.getResources().getString(R.string.no_internet_dialog_title));
        builder.setMessage(activity.getResources().getString(R.string.no_internet_dialog_msg));
        builder.setNegativeButton(activity.getResources().getString(R.string.settings_btn), (dialog, which) -> activity.startActivity(new Intent(Settings.ACTION_WIRELESS_SETTINGS)));
        builder.setPositiveButton(activity.getResources().getString(R.string.ok_btn), (dialog, which) -> {
            dialog.dismiss();
            activity.finish();
        });
        builder.create().show();
    }

    @JavascriptInterface
    public static void startDownload(String urlString, String filePath) {
        activity.runOnUiThread(() -> {
            stopDownload = false;
            int downloadProgress = 0;

            try {
                URL url = new URL(urlString);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.connect();

                int fileLength = urlConnection.getContentLength();
                InputStream inputStream = new BufferedInputStream(urlConnection.getInputStream());

                FileOutputStream fileOutputStream = new FileOutputStream(filePath);

                byte[] buffer = new byte[1024];
                int bufferLength;
                int total = 0;

                while ((bufferLength = inputStream.read(buffer)) > 0) {
                    fileOutputStream.write(buffer, 0, bufferLength);
                    total += bufferLength;

                    downloadProgress = (int) ((total * 100) / fileLength);

                    if (stopDownload) {
                        fileOutputStream.close();
                        urlConnection.disconnect();
                        break;
                    }
                }

                fileOutputStream.close();
                urlConnection.disconnect();
            } catch (IOException e) {

            } finally {
                stopDownload = false;
            }
        });
    }

    @JavascriptInterface
    public static void stopDownload(){
        stopDownload = true;
    }

    @JavascriptInterface
    public static void setPrefs(String key, String value){
        sp.edit().putString(key, value).apply();
    }

    @JavascriptInterface
    public static String getPrefs(String key, String defaultValue){
        return sp.getString(key, defaultValue);
    }

    @JavascriptInterface
    public static void removePrefs(String key){
        sp.edit().remove(key).apply();
    }

    @JavascriptInterface
    public static void clearPrefs(){
        sp.edit().clear().apply();
    }
}
