import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { redirect } from "react-router-dom";

export class AdminApi {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  sendRequest(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options?: {
      showToast?: boolean;
      onSuccessFunction?: (data: any) => void;
      onFinishFunction?: () => void;
      body?: any;
      successToastTitle?: string;
      successToastMessage?: string;
    }
  ) {
    const {
      showToast = false,
      onSuccessFunction,
      onFinishFunction,
      body,
      successToastTitle = "",
      successToastMessage = "",
    } = options || {};
    
    const token = this.getToken();
    if (token) {
      const requestMode = (() => {
        switch (method) {
          case "GET":
            return axios.get;
          case "POST":
            return axios.post;
          case "PUT":
            return axios.put;
          case "DELETE":
            return axios.delete;
        }
      })();

      let request;
      const headers = { headers: { Authorization: token } };

      if (body !== undefined) {
        request = requestMode(url, body, headers);
      } else {
        request = requestMode(url, headers);
      }

      request
        .then((response) => {
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                if (showToast) {
                  toast({
                    variant: "success",
                    title: successToastTitle,
                    description: successToastMessage,
                  });
                }
                if (onSuccessFunction) {
                  onSuccessFunction(response.data);
                }
            } else {
                throw new Error ("Something went wrong, the server responded with an unexpected status");
            }
        })
        .catch((error) => {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Unable to process your request. Please try again later.",
          });
        })
        .finally(() => {
          if (onFinishFunction) {
            onFinishFunction();
          }
        });
    } else {
        document.dispatchEvent(new CustomEvent("no-token"));
    }
  }
}