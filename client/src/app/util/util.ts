import swal from 'sweetalert';

export const handleGenericSubmit = async<T> (
  event: React.FormEvent,
  data: T, // 使用泛型
  apiPath: (data: T) => Promise<T>,
  CheckForm: () => boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  confirmationMessage: string = "Once started, the cache used in BVT will be created!" // 新增的参数，带有默认值
) => {
  event.preventDefault();

  // 校验表单
  if (!CheckForm()) {
    return; // 如果有错误，停止提交
  }

  swal({
    title: "Confirm the operation",
    text: confirmationMessage, // 使用传入的 confirmationMessage
    buttons: ["No", "Yes!"],
    dangerMode: true,
    closeOnClickOutside: false,
  }).then(async (willSubmit) => {
    setLoading(true);
    if (willSubmit) {
      try {
        const response = await apiPath(data);
        console.log(response);
        swal({
          title: "Submission was successful!",
          icon: "success",
          buttons: {
            confirm: {
              text: "OK!",
              value: true,
              visible: true,
              className: "",
              closeModal: true
            },
          },
          content: {
            element: "div",
            attributes: {
              innerHTML: "Go to <a href='https://portal.azure.com' target='_blank'>Azure portal</a>",
            },
          },
        });
      } catch (error) {
        console.log(error);
        
        if (error instanceof Error) {
          swal({
            title: "Error!",
            text: error.message,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK!",
                value: true,
                visible: true,
                className: "",
                closeModal: true
              },
            },
          });
        } else {
          swal({
            title: "Error!",
            text: "There was an issue with your submission.",
            icon: "error",
            buttons: {
              confirm: {
                text: "OK!",
                value: true,
                visible: true,
                className: "",
                closeModal: true
              },
            },
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  });
};
