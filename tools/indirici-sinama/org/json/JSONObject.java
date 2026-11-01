package org.json;
import java.util.*;
public class JSONObject {
  public static final Object NULL = new Object() { public String toString() { return "null"; } };
  final LinkedHashMap<String,Object> m = new LinkedHashMap<>();
  public JSONObject() {}
  public JSONObject(String s) throws JSONException { Object o = new P(s).val(); if (!(o instanceof JSONObject)) throw new JSONException("obj"); m.putAll(((JSONObject) o).m); }
  public JSONObject put(String k, Object v) throws JSONException { m.put(k, v); return this; }
  public JSONObject put(String k, long v) throws JSONException { m.put(k, v); return this; }
  public JSONObject put(String k, double v) throws JSONException { m.put(k, v); return this; }
  public String getString(String k) throws JSONException { Object o = m.get(k); if (o == null) throw new JSONException(k); return o.toString(); }
  public String optString(String k, String d) { Object o = m.get(k); return o == null || o == NULL ? d : o.toString(); }
  public long optLong(String k) { return optLong(k, 0); }
  public long optLong(String k, long d) { Object o = m.get(k); return o instanceof Number ? ((Number) o).longValue() : d; }
  public JSONArray optJSONArray(String k) { Object o = m.get(k); return o instanceof JSONArray ? (JSONArray) o : null; }
  public JSONArray getJSONArray(String k) throws JSONException { JSONArray a = optJSONArray(k); if (a == null) throw new JSONException(k); return a; }
  static String q(Object v) {
    if (v instanceof String) return "\"" + ((String) v).replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    return String.valueOf(v);
  }
  public String toString() { StringBuilder b = new StringBuilder("{"); boolean f = true; for (Map.Entry<String,Object> e : m.entrySet()) { if (!f) b.append(','); f = false; b.append(q(e.getKey())).append(':').append(q(e.getValue())); } return b.append('}').toString(); }
  static class P { final String s; int i; P(String s) { this.s = s; }
    void ws() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }
    Object val() throws JSONException { ws(); char c = s.charAt(i);
      if (c == '{') { i++; JSONObject o = new JSONObject(); ws(); if (s.charAt(i) == '}') { i++; return o; }
        while (true) { ws(); String k = (String) val(); ws(); i++; o.m.put(k, val()); ws(); if (s.charAt(i++) == '}') return o; } }
      if (c == '[') { i++; JSONArray a = new JSONArray(); ws(); if (s.charAt(i) == ']') { i++; return a; }
        while (true) { a.put(val()); ws(); if (s.charAt(i++) == ']') return a; } }
      if (c == '"') { i++; StringBuilder b = new StringBuilder(); while (s.charAt(i) != '"') { char d = s.charAt(i++); if (d == '\\') d = s.charAt(i++); b.append(d); } i++; return b.toString(); }
      if (s.startsWith("null", i)) { i += 4; return NULL; }
      if (s.startsWith("true", i)) { i += 4; return true; }
      if (s.startsWith("false", i)) { i += 5; return false; }
      int st = i; while (i < s.length() && "+-.0123456789eE".indexOf(s.charAt(i)) >= 0) i++;
      String n = s.substring(st, i); return n.contains(".") || n.contains("e") ? (Object) Double.parseDouble(n) : (Object) Long.parseLong(n); }
  }
}
