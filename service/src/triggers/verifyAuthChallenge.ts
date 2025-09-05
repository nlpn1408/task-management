export const handler = async (event: any) => {
  if (!event.response) {
    event.response = {};
  }

  // Lấy mã OTP từ yêu cầu của người dùng
  const userEnteredOtp = event.request.challengeAnswer;

  // Lấy mã OTP từ privateChallengeParameters (hardcoded 111111)
  const expectedOtp = event?.request?.privateChallengeParameters?.otp || "111111";
  
  console.log("🚀 ~ verifyAuthChallenge ~ userEnteredOtp:", userEnteredOtp, "expectedOtp:", expectedOtp);
  // Kiểm tra mã OTP
  if (userEnteredOtp === expectedOtp) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }

  return event;
};
