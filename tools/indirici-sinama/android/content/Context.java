package android.content;
import java.io.File;
public class Context {
  public static File root;
  public Context getApplicationContext() { return this; }
  public File getExternalFilesDir(String t) { return new File(root, t); }
  public File getFilesDir() { return root; }
}
