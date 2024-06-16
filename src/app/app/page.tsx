"use client";
import { useAuthorizedQuery } from "../hooks/gqty/useAuthorizedQuery";
import { useAuth } from "react-oidc-context";

export default () => {
  const { findManyConferenceMembers } = useAuthorizedQuery();
  const auth = useAuth();
  const myMemberships = findManyConferenceMembers({
    where: {
      user: {
        id: {
          equals: auth.user?.profile.sub,
        },
      },
    },
  });

  return (
    <div>
      {myMemberships.length}
      {myMemberships.map((membership) => (
        <div key={membership.conference.id}>{membership.conference.name}</div>
      ))}
    </div>
  );
};
