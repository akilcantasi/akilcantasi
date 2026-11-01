package org.json;
import java.util.*;
public class JSONArray {
  final ArrayList<Object> l = new ArrayList<>();
  public JSONArray put(Object v) { l.add(v); return this; }
  public JSONArray put(long v) { l.add(v); return this; }
  public int length() { return l.size(); }
  public String getString(int i) { return l.get(i).toString(); }
  public long getLong(int i) { return ((Number) l.get(i)).longValue(); }
  public JSONArray getJSONArray(int i) { return (JSONArray) l.get(i); }
  public JSONObject getJSONObject(int i) { return (JSONObject) l.get(i); }
  public String toString() { StringBuilder b = new StringBuilder("["); for (int i = 0; i < l.size(); i++) { if (i > 0) b.append(','); b.append(JSONObject.q(l.get(i))); } return b.append(']').toString(); }
}
