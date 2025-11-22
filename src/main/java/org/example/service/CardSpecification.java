package org.example.service;

import org.example.model.entity.Card;
import org.springframework.data.jpa.domain.Specification;

public class CardSpecification {

    public static Specification<Card> hasType(String type) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("type"), type));
    }

    public static Specification<Card> hasCourse(Integer course) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("course"), course));
    }

    public static Specification<Card> hasStudy(String study) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("study"), study));
    }

    public static Specification<Card> hasCity(String city) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("city"), city));
    }
}
