package com.pere_palacin.app.mappers;

public interface Mapper<Dao, Dto> {
    Dao mapFrom(Dto dto);
    Dto mapTo(Dao dao);

}
