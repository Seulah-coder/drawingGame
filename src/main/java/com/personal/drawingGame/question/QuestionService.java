package com.personal.drawingGame.question;

import com.personal.drawingGame.common.util.FileUtil;
import com.personal.drawingGame.common.util.TypeUtil;
import com.personal.drawingGame.user.User;
import com.personal.drawingGame.user.UserRepository;
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

    @Autowired
    UserRepository userRepository;

    public void submitAnswer(Map<String, Object> params) {
        Map<String, Object> resultMap = new HashMap<>();
        Long userId = TypeUtil.longValue(params.get("userId"));
        User user = userRepository.getById(userId);
        System.out.println("user = " + user);
        user.setCorrectCount(user.getCorrectCount() + 1);
        user.setAskingYn("Y");
        userRepository.save(user);
        //맞춘 count 올려줌

        String roomCode = TypeUtil.stringValue(params.get("roomCode"));
        List<User> users = userRepository.findAllByRoomCodeOrderByUserOrder(roomCode);
        int order = 0;
        for (User changeUser : users) {
            if(changeUser != user){
                changeUser.setAskingYn("N");
                userRepository.save(changeUser);
            }
            //맞춘 사람이 문제 내기
        }
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
