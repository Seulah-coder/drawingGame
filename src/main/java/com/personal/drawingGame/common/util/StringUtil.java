package com.personal.drawingGame.common.util;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.util.Base64;

@RequiredArgsConstructor
public class StringUtil {

    protected Logger logger = LoggerFactory.getLogger(StringUtil.class);

    private static MessageSource messageSource;



    //SHA256암호화
    public static String encryptionSHA256(String str) {
        String sha = "";
        try {
            MessageDigest sh = MessageDigest.getInstance("SHA-256");
            sh.update(str.getBytes());
            byte byteData[] = sh.digest();
            StringBuffer sb = new StringBuffer();
            for(int i=0;i<byteData.length;i++) {
                sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
            }
            sha = sb.toString();
        }catch(Exception e) {
            e.printStackTrace();
            sha = null;
        }
        return sha;
    }

    public static String encryptionSHA512(String str) {
        String sha = "";
        try {
            MessageDigest sh = MessageDigest.getInstance("SHA-512");
            sh.update(str.getBytes());
            byte byteData[] = sh.digest();
            StringBuffer sb = new StringBuffer();
            for(int i=0;i<byteData.length;i++) {
                sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
            }
            sha = sb.toString();
        }catch(Exception e) {
            e.printStackTrace();
            sha = null;
        }
        return sha;
    }
    //base64인코더
    public String base64Encode(String str) throws UnsupportedEncodingException {
        String result = "";

        byte[] targetBytes = str.getBytes("UTF-8");

        // Base64 인코딩 ///////////////////////////////////////////////////
        Base64.Encoder encoder = Base64.getEncoder();

        // Encoder#encode(byte[] src) :: 바이트배열로 반환
//	        byte[] encodedBytes = encoder.encode(targetBytes);
//	        rintln(new String(encodedBytes));

        // Encoder#encodeToString(byte[] src) :: 문자열로 반환
        String encodedString = encoder.encodeToString(targetBytes);

        result = encodedString;

        return result;
    }

    //base64디코더
    public String base64Decode(String str) throws UnsupportedEncodingException{
        String result = "";

        // Base64 디코딩 ///////////////////////////////////////////////////
        Base64.Decoder decoder = Base64.getDecoder();

        // Decoder#decode(bytes[] src)
//	        byte[] decodedBytes1 = decoder.decode(str);
        // Decoder#decode(String src)
        byte[] decodedBytes2 = decoder.decode(str);

        // 디코딩한 문자열을 표시
//	        String decodedString = new String(decodedBytes1, "UTF-8");
//	        rintln(decodedString);

        result = new String(decodedBytes2, "UTF-8");

        return result;
    }

    public static String getBooleanStr(boolean flag) {
        return flag ? "Y" : "N";
    }

    public static boolean isYn(String yn) {
        return "Y".equals(yn);
    }

    public static boolean byteCheck(String txt, int standardByte) {
        // 바이트 체크 (영문 1, 한글 2, 특문 1)
        int en = 0;
        int ko = 0;
        int etc = 0;

        char[] txtChar = txt.toCharArray();
        for (int j = 0; j < txtChar.length; j++) {
            if (txtChar[j] >= 'A' && txtChar[j] <= 'z') {
                en++;
            } else if (txtChar[j] >= '\uAC00' && txtChar[j] <= '\uD7A3') {
                ko++;
                ko++;
            } else {
                etc++;
            }
        }

        int txtByte = en + ko + etc;
        if (txtByte > standardByte) {
            return false;
        } else {
            return true;
        }
    }

    public static byte[] base64EncodeToBinary(byte[] buffer){
        return Base64.getEncoder().encode(buffer);
    }

    /**
     * 메이커 타입 코드를 Html 형식으로 변환한다.
     * @return
     */
    public static String stringToHtml(String str) {
        String parseStr = str;
        if (str.contains("\n")) {
            parseStr = str.replace("\n", "<br/>");
        } else if (str. contains("/")) {
            parseStr = str.replace("/", "<br/>");
        } else if (str.contains("·")) {
            parseStr = str.replace("·", "<br/>");
        }
        return parseStr;
    }

    /**
     * 이름 2번째 글자 *표 처리
     * @param name
     * @return
     */
    public static String maskingName(String name){
        if (!name.equals("핑퐁") && !name.isEmpty()){
            StringBuilder sb = new StringBuilder(name);
            sb.setCharAt(1, '*');
            name = sb.toString();
        }
        return name;
    }

    /**
     * script가 사라진 escape문자열을 얻는다.
     * @param targetText
     * @return
     */
    public static String escapeXss(String targetText) {
        String[] source = {"&", "<", ">", "\"", "'", "/", "%", "-"};
        String[] target = {"&amp;","&lt;","&gt;","&quot;","&#39;","&#47;", "&#37;","&#45;"};

        for (var i = 0; i < source.length; i++) {
            targetText = targetText.replaceAll(source[i], target[i]);
        }
        return targetText;
    }

    /**
     * script가 사라진 escape문자열을 얻는다.
     * @param targetText
     * @return
     */
    public static String resolveEscapeXss(String targetText) {
        String[] source = {"&amp;","&lt;","&gt;","&quot;","&#39;","&#47;", "&#37;","&#45;"};
        String[] target = {"&", "<", ">", "\"", "'", "/", "%", "-"};

        for (var i = 0; i < source.length; i++) {
            targetText = targetText.replaceAll(source[i], target[i]);
        }
        return targetText;
    }
}
