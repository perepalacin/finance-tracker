package com.pere_palacin.app.mappers;

public interface Mapper<A, B> {
    A mapFrom(B b);
    B mapTo(A a);

}
