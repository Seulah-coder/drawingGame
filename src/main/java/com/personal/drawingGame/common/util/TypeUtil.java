package com.personal.drawingGame.common.util;

import org.apache.ibatis.type.TypeException;

import java.util.List;
import java.util.Objects;

public class TypeUtil {
    /**
     * Long Value체크
     * 객체가 Long이 아니면 0 리턴
     * @param obj
     * @return
     */
    public static long longValue(Object obj) {
        long value = 0L;
        try {
            value = Long.parseLong(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * Long Value체크
     * 객체가 Long이 아니면 null 리턴
     * @param obj
     * @return
     */
    public static Long longObject(Object obj) {
        Long value = null;
        try {
            value = Long.parseLong(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * Boolean Value체크
     * 객체가 Boolean이 아니면 false
     * @param obj
     * @return
     */
    public static boolean booleanValue(Object obj) {
        boolean value = false;
        try {
            value = Boolean.parseBoolean(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * Boolean Value체크
     * 객체가 Boolean이 아니면 false
     * @param obj
     * @return
     */
    public static boolean booleanValue(Object obj, boolean defaultValue) {
        boolean value = defaultValue;
        try {
            value = Boolean.parseBoolean(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * Boolean Value체크
     * 객체가 Boolean이 아니면 null 리턴
     * @param obj
     * @return
     */
    public static Boolean booleanObject(Object obj) {
        Boolean value = null;
        try {
            value = Boolean.parseBoolean(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * int Value체크
     * 객체가 int가 아니면 0
     * @param obj
     * @return
     */
    public static int intValue(Object obj) {
        int value = 0;
        try {
            value = Integer.parseInt(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * int Value체크
     * 객체가 int가 아니면 0
     * @param obj
     * @return
     */
    public static int intValue(Object obj, int defaultValue) {
        int value = defaultValue;
        try {
            value = Integer.parseInt(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * int Object 체크
     * 객체가 int가 아니면 null 리턴
     * @param obj
     * @return
     */
    public static Integer integerObject(Object obj) {
        Integer value = null;
        try {
            if (!Objects.isNull(obj)) {
                value = Integer.parseInt(obj.toString());
            }
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * float Value체크
     * 객체가 float가 아니면 0
     * @param obj
     * @return
     */
    public static float floatValue(Object obj) {
        float value = 0.f;
        try {
            value = Float.parseFloat(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * float Value체크
     * 객체가 float가 아니면 0
     * @param obj
     * @return
     */
    public static float floatValue(Object obj, float defaultValue) {
        float value = defaultValue;
        try {
            value = Float.parseFloat(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * Float Object 체크
     * 객체가 int가 아니면 null 리턴
     * @param obj
     * @return
     */
    public static Float floatObject(Object obj) {
        Float value = null;
        try {
            value = Float.parseFloat(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * double Value체크
     * 객체가 double이 아니면 0
     * @param obj
     * @return
     */
    public static double doubleValue(Object obj) {
        double value = 0.0;
        try {
            value = Double.parseDouble(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * double Value체크
     * 객체가 double이 아니면 0
     * @param obj
     * @return
     */
    public static double doubleValue(Object obj, double defaultValue) {
        double value = defaultValue;
        try {
            value = Double.parseDouble(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * Double Object 체크
     * 객체가 int가 아니면 null 리턴
     * @param obj
     * @return
     */
    public static Double doubleObject(Object obj) {
        Double value = null;
        try {
            value = Double.parseDouble(obj.toString());
        } catch (Exception e) {
            // 아무것도 안해야 실패 시 정상적으로 0이 리턴
        }
        return value;
    }

    /**
     * Object가 Null인지 체크함.
     * Null 이면 ""를 리턴, Null이 아니면 Object를 String으로 변환하여 리턴
     * @param object
     * @return
     */
    public static String stringValue(Object object){
        String result = "";
        if (object == null || String.valueOf(object).equals("null") || String.valueOf(object).equals("") ){
            result   =   "";
        } else {
            result = String.valueOf(object);
        }
        return result;
    }

    public static String stringValue(Object object, String res){
        String result = "";
        if (object == null || String.valueOf(object).equals("null") || String.valueOf(object).equals("") ){
            result   =   "";
            if (res != null) {
                result = res;
            }
        } else {
            result = String.valueOf(object);
        }
        return result;
    }

    /**
     * 해당 오브젝트에 해당하는 값을 리턴한다.
     * @param object
     * @param clazz
     * @param <T>
     */
    public static <T> T get(Object object, Class<T> clazz) {
        T t = null;
        try {
            if (clazz.isInstance(object)) {
                t = (T) object;
            }
        } catch (Exception e) {

        }
        return t;
    }

    /**
     * 해당 오브젝트에 해당하는 리스트 값을 리턴한다.
     * @param object
     * @param clazz
     * @param <T>
     */
    public static <T> List<T> getList(Object object, Class<T> clazz) {
        List<T> t = null;
        try {
            t = (List<T>) object;
        } catch (Exception e) {

        }
        return t;
    }

    /**
     * code 값을 Enum으로 변환해준다.
     * @param type
     * @param code
     * @return
     * @param <T>
     */
    public static <T extends CodeEnum> T getCodeEnum(Class<T> type, String code) {
        try {
            CodeEnum[] enumConstants = (CodeEnum[]) type.getEnumConstants();
            for (CodeEnum codeNum: enumConstants) {
                if (codeNum.getCode().equals(code)) {
                    return (T)codeNum;
                }
            }
            return null;
        } catch (Exception e) {
            throw new TypeException("Can't make enum object '" + type + "'", e);
        }
    }

    /**
     * Object에 대한 Null 체킹
     * @param object
     * @return
     */
    public static boolean isNull(Object object) {
        return Objects.isNull(object) || TypeUtil.stringValue(object).isEmpty();
    }

}
