# RCS Proof Assets Cloud Run Service

Status: source added for a dedicated public read-only asset proxy. It is intended to serve non-sensitive RCS registration proof assets from the private GCS bucket `rightonq-rcs-proof-assets`.

Why this exists:

- `rightonq-gog` enforces `iam.allowedPolicyMemberDomains`, so bucket-level public `allUsers` IAM grants are blocked.
- `rightonq-gog` enforces `storage.uniformBucketLevelAccess`, so object-level public ACLs are also blocked.
- Signed URLs are not suitable for RCS review because they expire.
- A tiny public Cloud Run service can serve selected private GCS objects without making the bucket public or listable.

Runtime boundary:

- Service name: `roq-rcs-proof-assets`.
- Region: `europe-west2`.
- Bucket: `rightonq-rcs-proof-assets`.
- Max scale: `2`; min instances: `0`; concurrency: `20`.
- Public path prefix: `rcs-proof/`.
- Allowed methods: `GET`, `HEAD`.
- No upload endpoint, no directory listing, no secrets, no provider callback handling, no Apps Script writes, no Twilio submission.

Asset rule:

Only public, non-sensitive registration proof assets belong in this bucket path: approved logo/banner files, opt-in proof images, and review videos. Do not store ID documents, representative evidence, credentials, customer lists, private message logs, or raw provider secrets here.
