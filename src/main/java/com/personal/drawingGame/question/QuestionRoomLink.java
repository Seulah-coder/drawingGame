package com.personal.drawingGame.question;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class QuestionRoomLink {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String jsonData;
    @Column
    private int roomId;
    @Column
    private int questionOrder;
}
