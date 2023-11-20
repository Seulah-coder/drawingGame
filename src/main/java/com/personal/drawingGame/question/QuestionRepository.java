package com.personal.drawingGame.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /*문제 하나 랜덤으로 뽑기*/
    @Query(value = "SELECT * FROM QUESTION order by RAND() limit 1", nativeQuery = true)
    List<Question> findOneByRandom();

}
