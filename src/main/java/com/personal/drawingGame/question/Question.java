package com.personal.drawingGame.question;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Question {

    @Id
    @GeneratedValue
    private Long id;
    @Column
    private String question;
}
