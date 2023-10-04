package com.personal.drawingGame.user;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String userName;
    @Column
    private String roomCode;
    @Column
    private int correctCount;
    @Column
    private String endStatus;
    @Column
    private int userRole;
}
