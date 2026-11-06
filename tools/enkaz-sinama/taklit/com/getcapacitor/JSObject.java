package com.getcapacitor;

import java.util.LinkedHashMap;
import java.util.Map;

/** Sınama taklidi: MeshPeer.toJS'in kullandığı kadarı (gerçeği org.json.JSONObject'ten türer). */
public class JSObject {
  public final Map<String, Object> m = new LinkedHashMap<>();
  public JSObject put(String k, Object v) { m.put(k, v); return this; }
}
