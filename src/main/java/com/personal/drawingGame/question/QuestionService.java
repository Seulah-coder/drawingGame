package com.personal.drawingGame.question;

import com.personal.drawingGame.common.util.FileUtil;
import com.personal.drawingGame.common.util.TypeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class QuestionService {

    @Autowired
    QuestionRepository questionRepository;

    public Map<String, Object> submitAnswer(Map<String, Object> params) {

        Map<String, Object> resultMap = new HashMap<>();
        System.out.println("resultMap = " + resultMap);

        return resultMap;
    }

    public Question getQuestion(){

        Question question = new Question();

        List<Question> ramdomQuestion = questionRepository.findOneByRandom();

        question = ramdomQuestion.get(0);

        return question;
    }

    public Map<String, Object> ocrProgress(Map<String, Object> params) throws Exception{

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String url = TypeUtil.stringValue(params.get("imageUrl"));
            String realPath = TypeUtil.stringValue(params.get("realPath"));
            String roomCode = TypeUtil.stringValue(params.get("roomCode"));
            System.out.println("url = " + url);
            Map<String, Object> getImgUrl = FileUtil.convertBase64StringToImage(url, roomCode, realPath);
            System.out.println("getImgUrl = " + getImgUrl);

        }catch (Exception e){
            e.printStackTrace();
        }

        return resultMap;

    }
}
