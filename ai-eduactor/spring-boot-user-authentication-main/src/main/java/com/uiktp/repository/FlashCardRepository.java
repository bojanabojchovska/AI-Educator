package com.uiktp.repository;

import com.uiktp.model.FlashCard;
import com.uiktp.model.UserCourseAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@EnableJpaRepositories
@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
    //List<FlashCard> findByCourseId(Long courseId);
//    List<FlashCard> findByCourseIdAndUserId(Long courseId, Long userId);

    List<FlashCard> findAllByAttachment(UserCourseAttachment attachment);

    boolean existsByQuestion(String question);
}
