export const handler = async (event: any) => {
  if (!event.response) {
    event.response = {};
  }

  // Hardcode OTP là 1111
  const otp = "111111";
  event.response.publicChallengeParameters = {};
  event.response.privateChallengeParameters = { otp };
  event.response.challengeMetadata = "OTP";

  return event;
};
