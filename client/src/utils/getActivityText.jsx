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
          <b className="font-semibold text-slate-800">{name}</b> created task <b className="font-semibold text-slate-800">"
          {activity.details.taskTitle}"</b>
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
          <b className="font-semibold text-slate-800">{name}</b> invited <b className="font-semibold text-slate-800">{activity.details.email}</b> as a {activity.details.role}
        </>
      );

    case "MEMBER_JOINED":
      return (
        <>
          <b className="font-semibold text-slate-800">{activity.details.memberName} </b>({activity.details.email}) joined <b className="font-semibold text-slate-800">"{activity.details.workspace}"</b> as a {activity.details.role}
        </>
      );

    case "TASK_STATUS_CHANGED":
      return (
        <>
          <b className="font-semibold text-slate-800">{name}</b> set Task: <b className="font-semibold text-slate-800">"{activity.details.taskTitle}"</b> from {activity.details.previousStatus} to {activity.details.currentStatus}
        </>
      );

    default:
      return activity.action;
  }
};