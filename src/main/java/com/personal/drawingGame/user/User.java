package com.personal.drawingGame.user;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table
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
    @Column
    private int userOrder;
}
