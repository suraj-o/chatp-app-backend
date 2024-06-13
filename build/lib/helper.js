export const otherUser = (member, userId) => (member.find((member) => member._id.toString() !== userId));
