(() => {
  f = (p, m) => {
    const authors = {
      pengxie: "Peng",
      yfinn: "Finn",
      dban: "David",
      shenghaowang: "Eric",
      rolantchang: "Kuangyi",
      bontyhwang: "Bonty",
    };

    p instanceof Promise ? p.then((r) => r.json()).then(main) : main(p);

    function main(data) {
      const issues = (data || [])[0]?.data?.project?.issues?.nodes || [];
      const findGUILabel = (itm) => {
        return itm.labels?.nodes
          ?.map((itm) => itm.title)
          ?.find((itm) => {
            return typeof itm === "string" && itm.startsWith("GUI");
          });
      };
      const gui_issues = issues.filter((itm) => {
        return findGUILabel(itm);
      });

      const output = gui_issues.map((itm) => {
        const gui_label = findGUILabel(itm);
        return `${itm.title}  --${itm?.assignees?.nodes
          ?.map((itm) => itm.username)
          ?.filter((itm) => Object.keys(authors).includes(itm))
          .map((itm) => authors[itm])
          .join(",")} --${gui_label
          .replace(/(GUI::)/, "")
          .replace(/\s+/g, "")} ${
          gui_label.indexOf("Ready") < 0 && itm.dueDate
            ? `--${itm.dueDate.replace(/^\d+\-/, "")}`
            : ""
        }`;
      });

      if (typeof m === "string" && m.startsWith("groupby:")) {
        const groupby = m.replace("groupby:", "");
        const states = ["Ready", "Ongoing", "ToDo"];

        if (groupby === "state") {
          const grouped = output.reduce((acc, itm) => {
            const matched = itm.match(RegExp(`--(${states.join("|")})`));
            const state = matched?.at(1);
            if (!acc[state]) {
              acc[state] = [];
            }
            acc[state].push(itm.replace(matched?.at(0), ""));
            return acc;
          }, {});

          console.log(
            Object.keys(grouped)
              .map((itm) => {
                return `## ${itm}\n${grouped[itm].join("\n")}`;
              })
              .join("\n\n")
          );
        }

        return;
      }

      console.log(output.join("\n"));
    }
  };

  if (location.pathname.includes("fortiwebcloud/fortiwebcloud")) {
    fetch("https://dops-git106.fortinet-us.com/api/graphql", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-US,en;q=0.9,zh-US;q=0.8,zh;q=0.7,zh-CN;q=0.6,pt;q=0.5,zh-TW;q=0.4",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": Array.from(document.getElementsByTagName("meta")).find(
          (itm) => itm.name === "csrf-token"
        ).content,
        "x-gitlab-feature-category": "team_planning",
      },
      referrer: `https://dops-git106.fortinet-us.com/fortiwebcloud/fortiwebcloud/-/issues/?sort=created_date&state=opened&milestone_title=${location.search
        .split("&")
        .find((itm) => itm.indexOf("milestone_title") === 0)
        .split("=")
        .pop()}&first_page_size=20`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `[{\"operationName\":\"getIssuesEE\",\"variables\":{\"hideUsers\":false,\"isProject\":true,\"isSignedIn\":true,\"fullPath\":\"fortiwebcloud/fortiwebcloud\",\"sort\":\"CREATED_DESC\",\"state\":\"opened\",\"firstPageSize\":100,\"milestoneTitle\":\"${location.search
        .split("&")
        .find((itm) => itm.indexOf("milestone_title") === 0)
        .split("=")
        .pop()}\",\"types\":[\"ISSUE\",\"INCIDENT\",\"TEST_CASE\",\"TASK\"]},\"query\":\"query getIssuesEE($hideUsers: Boolean = false, $isProject: Boolean = false, $isSignedIn: Boolean = false, $fullPath: ID!, $iid: String, $search: String, $sort: IssueSort, $state: IssuableState, $assigneeId: String, $assigneeUsernames: [String!], $authorUsername: String, $confidential: Boolean, $labelName: [String], $milestoneTitle: [String], $milestoneWildcardId: MilestoneWildcardId, $myReactionEmoji: String, $releaseTag: [String!], $releaseTagWildcardId: ReleaseTagWildcardId, $types: [IssueType!], $epicId: String, $iterationId: [ID], $iterationWildcardId: IterationWildcardId, $weight: String, $healthStatus: HealthStatusFilter, $crmContactId: String, $crmOrganizationId: String, $not: NegatedIssueFilterInput, $or: UnionedIssueFilterInput, $beforeCursor: String, $afterCursor: String, $firstPageSize: Int, $lastPageSize: Int) {\\n  group(fullPath: $fullPath) @skip(if: $isProject) {\\n    id\\n    issues(\\n      includeSubepics: true\\n      includeSubgroups: true\\n      iid: $iid\\n      search: $search\\n      sort: $sort\\n      state: $state\\n      assigneeId: $assigneeId\\n      assigneeUsernames: $assigneeUsernames\\n      authorUsername: $authorUsername\\n      confidential: $confidential\\n      labelName: $labelName\\n      milestoneTitle: $milestoneTitle\\n      milestoneWildcardId: $milestoneWildcardId\\n      myReactionEmoji: $myReactionEmoji\\n      types: $types\\n      epicId: $epicId\\n      iterationId: $iterationId\\n      iterationWildcardId: $iterationWildcardId\\n      weight: $weight\\n      healthStatusFilter: $healthStatus\\n      crmContactId: $crmContactId\\n      crmOrganizationId: $crmOrganizationId\\n      not: $not\\n      or: $or\\n      before: $beforeCursor\\n      after: $afterCursor\\n      first: $firstPageSize\\n      last: $lastPageSize\\n    ) {\\n      pageInfo {\\n        ...PageInfo\\n        __typename\\n      }\\n      nodes {\\n        ...IssueFragment\\n        reference(full: true)\\n        blockingCount\\n        healthStatus\\n        weight\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  project(fullPath: $fullPath) @include(if: $isProject) {\\n    id\\n    issues(\\n      includeSubepics: true\\n      iid: $iid\\n      search: $search\\n      sort: $sort\\n      state: $state\\n      assigneeId: $assigneeId\\n      assigneeUsernames: $assigneeUsernames\\n      authorUsername: $authorUsername\\n      confidential: $confidential\\n      labelName: $labelName\\n      milestoneTitle: $milestoneTitle\\n      milestoneWildcardId: $milestoneWildcardId\\n      myReactionEmoji: $myReactionEmoji\\n      releaseTag: $releaseTag\\n      releaseTagWildcardId: $releaseTagWildcardId\\n      types: $types\\n      epicId: $epicId\\n      iterationId: $iterationId\\n      iterationWildcardId: $iterationWildcardId\\n      weight: $weight\\n      healthStatusFilter: $healthStatus\\n      crmContactId: $crmContactId\\n      crmOrganizationId: $crmOrganizationId\\n      not: $not\\n      or: $or\\n      before: $beforeCursor\\n      after: $afterCursor\\n      first: $firstPageSize\\n      last: $lastPageSize\\n    ) {\\n      pageInfo {\\n        ...PageInfo\\n        __typename\\n      }\\n      nodes {\\n        ...IssueFragment\\n        blockingCount\\n        healthStatus\\n        weight\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment PageInfo on PageInfo {\\n  hasNextPage\\n  hasPreviousPage\\n  startCursor\\n  endCursor\\n  __typename\\n}\\n\\nfragment IssueFragment on Issue {\\n  id\\n  iid\\n  confidential\\n  createdAt\\n  downvotes\\n  dueDate\\n  hidden\\n  humanTimeEstimate\\n  mergeRequestsCount\\n  moved\\n  state\\n  title\\n  updatedAt\\n  closedAt\\n  upvotes\\n  userDiscussionsCount @include(if: $isSignedIn)\\n  webPath\\n  webUrl\\n  type\\n  assignees @skip(if: $hideUsers) {\\n    nodes {\\n      id\\n      avatarUrl\\n      name\\n      username\\n      webUrl\\n      __typename\\n    }\\n    __typename\\n  }\\n  author @skip(if: $hideUsers) {\\n    id\\n    avatarUrl\\n    name\\n    username\\n    webUrl\\n    __typename\\n  }\\n  labels {\\n    nodes {\\n      id\\n      color\\n      title\\n      description\\n      __typename\\n    }\\n    __typename\\n  }\\n  milestone {\\n    id\\n    dueDate\\n    startDate\\n    webPath\\n    title\\n    __typename\\n  }\\n  taskCompletionStatus {\\n    completedCount\\n    count\\n    __typename\\n  }\\n  __typename\\n}\\n\"}]`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    })
      .then((r) => r.json())
      .then((r) => f(r, "groupby:state"));
  }

  if (location.pathname.includes("dolphin/controller")) {
    fetch("https://dops-git.fortinet-us.com/api/graphql", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-US,en;q=0.9,zh-US;q=0.8,zh;q=0.7,zh-CN;q=0.6,pt;q=0.5,zh-TW;q=0.4",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": document.querySelector("meta[name=csrf-token]")
          ?.content,
      },
      referrer:
        "https://dops-git.fortinet-us.com/dolphin/controller/-/issues/?sort=created_date&state=opened&milestone_title=1.0-GA&first_page_size=100",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `[{\"operationName\":\"getIssues\",\"variables\":{\"hideUsers\":false,\"isProject\":true,\"isSignedIn\":true,\"fullPath\":\"dolphin/controller\",\"sort\":\"CREATED_DESC\",\"state\":\"opened\",\"firstPageSize\":100,\"search\":\"[GUI]\",\"milestoneTitle\":\"${location.search
        .split("&")
        .find((itm) => itm.indexOf("milestone_title") === 0)
        .split("=")
        .pop()}\",\"types\":[\"ISSUE\",\"INCIDENT\",\"TEST_CASE\",\"TASK\"]},\"query\":\"query getIssues($hideUsers: Boolean = false, $isProject: Boolean = false, $isSignedIn: Boolean = false, $fullPath: ID!, $iid: String, $search: String, $sort: IssueSort, $state: IssuableState, $assigneeId: String, $assigneeUsernames: [String!], $authorUsername: String, $confidential: Boolean, $labelName: [String], $milestoneTitle: [String], $milestoneWildcardId: MilestoneWildcardId, $myReactionEmoji: String, $releaseTag: [String!], $releaseTagWildcardId: ReleaseTagWildcardId, $types: [IssueType!], $crmContactId: String, $crmOrganizationId: String, $not: NegatedIssueFilterInput, $beforeCursor: String, $afterCursor: String, $firstPageSize: Int, $lastPageSize: Int) {\\n  group(fullPath: $fullPath) @skip(if: $isProject) {\\n    id\\n    issues(\\n      includeSubgroups: true\\n      iid: $iid\\n      search: $search\\n      sort: $sort\\n      state: $state\\n      assigneeId: $assigneeId\\n      assigneeUsernames: $assigneeUsernames\\n      authorUsername: $authorUsername\\n      confidential: $confidential\\n      labelName: $labelName\\n      milestoneTitle: $milestoneTitle\\n      milestoneWildcardId: $milestoneWildcardId\\n      myReactionEmoji: $myReactionEmoji\\n      types: $types\\n      crmContactId: $crmContactId\\n      crmOrganizationId: $crmOrganizationId\\n      not: $not\\n      before: $beforeCursor\\n      after: $afterCursor\\n      first: $firstPageSize\\n      last: $lastPageSize\\n    ) {\\n      pageInfo {\\n        ...PageInfo\\n        __typename\\n      }\\n      nodes {\\n        ...IssueFragment\\n        reference(full: true)\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  project(fullPath: $fullPath) @include(if: $isProject) {\\n    id\\n    issues(\\n      iid: $iid\\n      search: $search\\n      sort: $sort\\n      state: $state\\n      assigneeId: $assigneeId\\n      assigneeUsernames: $assigneeUsernames\\n      authorUsername: $authorUsername\\n      confidential: $confidential\\n      labelName: $labelName\\n      milestoneTitle: $milestoneTitle\\n      milestoneWildcardId: $milestoneWildcardId\\n      myReactionEmoji: $myReactionEmoji\\n      releaseTag: $releaseTag\\n      releaseTagWildcardId: $releaseTagWildcardId\\n      types: $types\\n      crmContactId: $crmContactId\\n      crmOrganizationId: $crmOrganizationId\\n      not: $not\\n      before: $beforeCursor\\n      after: $afterCursor\\n      first: $firstPageSize\\n      last: $lastPageSize\\n    ) {\\n      pageInfo {\\n        ...PageInfo\\n        __typename\\n      }\\n      nodes {\\n        ...IssueFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment PageInfo on PageInfo {\\n  hasNextPage\\n  hasPreviousPage\\n  startCursor\\n  endCursor\\n  __typename\\n}\\n\\nfragment IssueFragment on Issue {\\n  id\\n  iid\\n  confidential\\n  createdAt\\n  downvotes\\n  dueDate\\n  hidden\\n  humanTimeEstimate\\n  mergeRequestsCount\\n  moved\\n  state\\n  title\\n  updatedAt\\n  closedAt\\n  upvotes\\n  userDiscussionsCount @include(if: $isSignedIn)\\n  webPath\\n  webUrl\\n  type\\n  assignees @skip(if: $hideUsers) {\\n    nodes {\\n      id\\n      avatarUrl\\n      name\\n      username\\n      webUrl\\n      __typename\\n    }\\n    __typename\\n  }\\n  author @skip(if: $hideUsers) {\\n    id\\n    avatarUrl\\n    name\\n    username\\n    webUrl\\n    __typename\\n  }\\n  labels {\\n    nodes {\\n      id\\n      color\\n      title\\n      description\\n      __typename\\n    }\\n    __typename\\n  }\\n  milestone {\\n    id\\n    dueDate\\n    startDate\\n    webPath\\n    title\\n    __typename\\n  }\\n  taskCompletionStatus {\\n    completedCount\\n    count\\n    __typename\\n  }\\n  __typename\\n}\\n\"}]`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    })
      .then((r) => r.json())
      .then((r) => f(r, "groupby:state"));
  }
})();
