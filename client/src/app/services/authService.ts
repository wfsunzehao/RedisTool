// src/services/authService.ts
import { InteractiveBrowserCredential } from '@azure/identity';

// 配置 Azure AD 信息
const tenantId = '72f988bf-86f1-41af-91ab-2d7cd011db47';  // Azure 租户 ID
const clientId = 'd12243c1-a5bb-4217-92ba-c0da3d5c10ab';  // Azure 应用客户端 ID
//const redirectUri = 'http://localhost:3000';  // 应用的重定向 URI

export const getAccessToken = async () => {
  try {
    // 初始化 InteractiveBrowserCredential
    const credential = new InteractiveBrowserCredential({
      tenantId,
      clientId,
      //redirectUri,
    });

    // 获取访问 token
    const tokenResponse = await credential.getToken("https://management.azure.com/.default");  // 请求的权限范围
    const accessToken = tokenResponse.token;
    console.log("Access Token:", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Error obtaining token:", error);
    throw error;
  }
};

export const sendTokenToBackend = async (accessToken: string) => {
  try {
    const response = await fetch('<your-backend-api-url>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,  // 添加 Bearer Token
      },
      body: JSON.stringify({
        // 传递给后端的其他数据
      }),
    });

    if (response.ok) {
      console.log("Token sent successfully!");
    } else {
      console.error("Error sending token to backend:", response.status);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
