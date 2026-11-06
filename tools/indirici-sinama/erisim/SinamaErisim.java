package org.akilcantasi.app;

import java.util.List;

/** Sınama (Test.java, varsayılan paket) için PaketIndirici'nin paket içi yöntemlerine erişim. */
public final class SinamaErisim {
  private SinamaErisim() {}
  public static boolean izinliAdres(String u) { return PaketIndirici.izinliAdres(u); }
  public static List<String> expandMirrors(List<String> urls) { return PaketIndirici.expandMirrors(urls); }
}
