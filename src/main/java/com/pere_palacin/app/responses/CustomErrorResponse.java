package com.pere_palacin.app.responses;

import lombok.*;

@Data
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CustomErrorResponse {
    private final int StatusCode;
    private final String message;
}
