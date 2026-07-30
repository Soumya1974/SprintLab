export const getActivityText = (activity) => {
  const name = activity.userId?.name || "Someone";

  switch (activity.action) {
    case "WORKSPACE_CREATED":
      return (
        <>
          <b className="font-semibold text-slate-800">{name}</b> created workspace "
          {activity.details.workspaceTitle}"
        </>
      );

    case "TASK_CREATED":
      return (
        <>
          <b className="font-semibold text-slate-800">{name}</b> created task "
          {activity.details.taskTitle}"
        </>
      );

    case "COMMENT_ADDED":
      return (
        <>
          <b className="font-semibold text-slate-800">{name}</b> added a comment
        </>
      );

    case "MEMBER_INVITED":
      return (
        <>
          <b className="font-semibold text-slate-800">{name}</b> invited {activity.details.email} as a {activity.details.role}
        </>
      );
      
    case "MEMBER_JOINED":
      return (
        <>
          <b className="font-semibold text-slate-800">{activity.details.email}</b> joined {activity.details.workspace} as a {activity.details.role}
        </>
      );

    default:
      return activity.action;
  }
};