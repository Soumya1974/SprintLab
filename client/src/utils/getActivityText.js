export const getActivityText = (activity) => {

    switch(activity.action){

        case "WORKSPACE_CREATED":
            return `${activity.userId.name} created workspace "${activity.details.workspaceTitle}"`;

        case "TASK_CREATED":
            return `${activity.userId.name} created task "${activity.details.taskTitle}"`;

        case "COMMENT_ADDED":
            return `${activity.userId.name} added a comment`;

        case "MEMBER_INVITED":
            return `${activity.userId.name} invited ${activity.details.email}`;

        default:
            return activity.action;
    }

}