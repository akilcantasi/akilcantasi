package android.content.res;

import java.io.IOException;
import java.io.InputStream;

/** Sınama için AssetManager taklidi: hiçbir dosya yok */
public class AssetManager {
    public InputStream open(String name) throws IOException {
        throw new java.io.FileNotFoundException(name);
    }
}
