package org.akilcantasi.app;

/** MeshPeer paket içi olduğu için sınaması aynı pakette; Test.main çağırır. Dönen: hata sayısı */
public final class MeshSinama {
  private MeshSinama() {}
  static int hata = 0;
  static void ok(boolean c, String m) { System.out.println((c ? "OK   " : "HATA ") + m); if (!c) hata++; }

  public static int calistir() {
    MeshPeer p = new MeshPeer("E1");
    p.setEndpointName("abcd1234|Ayşe");
    ok(p.node.equals("abcd1234") && p.name.equals("Ayşe"), "mesh: reklam adı ayrışır");
    p = new MeshPeer("E2");
    p.setEndpointName("Mehmet");
    ok(p.node.isEmpty() && p.name.equals("Mehmet"), "mesh: ayırıcısız ad");
    p = new MeshPeer("E3");
    p.setEndpointName("<b>x</b>|‮evil\u0000​ad\n");
    ok(p.node.isEmpty() && p.name.equals("evilad"), "mesh: biçimsiz düğüm kimliği atılır, denetim/yön karakterleri temizlenir: " + p.name);
    p = new MeshPeer("E4");
    StringBuilder uzun = new StringBuilder("abcd1234|");
    for (int i = 0; i < 100; i++) uzun.append('a');
    p.setEndpointName(uzun.toString());
    ok(p.name.length() == MeshPeer.AD_EN_COK, "mesh: ad " + MeshPeer.AD_EN_COK + " karakterle sınırlı");
    p = new MeshPeer("E5");
    StringBuilder emo = new StringBuilder("abcd1234|");
    for (int i = 0; i < MeshPeer.AD_EN_COK - 1; i++) emo.append('a');
    emo.append("😀");
    p.setEndpointName(emo.toString());
    ok(p.name.length() == MeshPeer.AD_EN_COK - 1 && !Character.isHighSurrogate(p.name.charAt(p.name.length() - 1)), "mesh: kısaltma vekil çiftini bölmez");
    ok(MeshPeer.encodeName("abcd1234", "A|B").equals("abcd1234|A B"), "mesh: kendi adımızda ayırıcı kalmaz");

    // Gelen çerçeve sınırı (jeton kovası)
    MeshPeer k = new MeshPeer("K");
    int kabul = 0;
    for (int i = 0; i < 30; i++) if (k.jetonAl(1000)) kabul++;
    ok(kabul == 30, "mesh: tam eşitleme kadar çerçeve (30) bir anda geçer");
    for (int i = 0; i < 500; i++) if (k.jetonAl(1000)) kabul++;
    ok(kabul == MeshPeer.KOVA && k.atilan == 530 - MeshPeer.KOVA, "mesh: sel gibi gelen çerçeve kovadan sonra atılır (" + kabul + " geçti)");
    int sonra = 0;
    for (int i = 0; i < 100; i++) if (k.jetonAl(2000)) sonra++;
    ok(sonra == MeshPeer.HIZ, "mesh: saniyede " + MeshPeer.HIZ + " çerçeve yeniden açılır (" + sonra + ")");
    int geri = 0;
    for (int i = 0; i < 10; i++) if (k.jetonAl(500)) geri++;
    ok(geri == 0, "mesh: saat geri giderse jeton eklenmez");
    int uzunSonra = 0;
    for (int i = 0; i < 1000; i++) if (k.jetonAl(10_000_000)) uzunSonra++;
    ok(uzunSonra == MeshPeer.KOVA, "mesh: uzun aradan sonra en çok kova kadar");
    return hata;
  }
}
