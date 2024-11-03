package com.pere_palacin.app.exceptions;

public class ImproperInvestmentDatesExpection extends RuntimeException {
    public ImproperInvestmentDatesExpection() {
        super(
                "The start date of an investment should be prior to it's end date"
        );
    }
}
