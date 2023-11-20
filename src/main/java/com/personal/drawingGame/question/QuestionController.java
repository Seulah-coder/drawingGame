package com.personal.drawingGame.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
public class QuestionController {

    @Autowired
    QuestionService questionService;

    @PostMapping("/submitAnswer")
    @ResponseBody
    public Map<String, Object> submitAnswer(HttpServletRequest request, Map<String, Object> params){
        Map<String, Object> resultMap = new HashMap<>();
        try {
            resultMap = questionService.submitAnswer(params);

        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    @PostMapping("/ocrProgress")
    @ResponseBody
    public Map<String, Object> ocrProgress(HttpServletRequest request, @RequestBody HashMap<String, Object> params, HttpSession session, HttpServletResponse response){
        Map<String, Object> resultMap = new HashMap<>();

        try{
            System.out.println("params11111111111111111111111111 = " + params);
            ServletContext context = request.getSession().getServletContext();
            String path = "/upload/answers/";
            String realPath = context.getRealPath(path);
            params.put("realPath", realPath);
            System.out.println("params222222222222222222222222222 = " + params);

            resultMap = questionService.ocrProgress(params);

        }catch (Exception e){
            e.printStackTrace();
        }

        return resultMap;
    }
}
