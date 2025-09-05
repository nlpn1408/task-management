export const handler = async (event: any) => {
  const session = event.request.session || [];

  if (session.length === 0) {
    // Lần đầu, yêu cầu OTP
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  } else {
    const lastChallenge = session[session.length - 1];
    if (
      lastChallenge.challengeName === "CUSTOM_CHALLENGE" &&
      lastChallenge.challengeResult === true
    ) {
      // OTP thành công, cấp token
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else if (
      lastChallenge.challengeName === "CUSTOM_CHALLENGE" &&
      lastChallenge.challengeResult === false
    ) {
      // OTP sai, thử lại
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = "CUSTOM_CHALLENGE";
    } else {
      // Thất bại khác, fail auth
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    }
  }

  return event;
};
