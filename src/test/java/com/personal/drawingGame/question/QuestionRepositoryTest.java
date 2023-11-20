package com.personal.drawingGame.question;

import com.personal.drawingGame.room.Room;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class QuestionRepositoryTest {

    @Autowired
    QuestionRepository questionRepository;

    @Test
    public void findRandomQuestion() {
        List<Question> test = questionRepository.findOneByRandom();
        System.out.println("test = " + test.get(0).getQuestion());
    }

}