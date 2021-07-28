## How it works?

With this action you'll be able to check the necessary env vars your project needs are already located on AWS Secret manager. 

You only need a JSON file with your mandatory env vars like this: 

```json
{
  "FOO": true,
  "BAR": true
}
```

The action will compare the keys in your json file and they'll be compared against AWS Secrets manager. 

## How to use? 

```yaml
    steps:
      - uses: flavioaandres/secrets-manager-env-checker@v2
        with: 
          path_to_json: './broker-ui/.requiredenvs.json' #File to compare
          aws_secret_name: prod/compliance/engine/brokerui 
          AWS_ACCESS_KEY: {{secrets.AWS_ACCESS_KEY}}
          AWS_SECRET_KEY: {{secrets.AWS_SECRET_KEY}}
```

## Necessary permissions

You can attach the following policy to your user: 

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "your_custom_unique_id",
            "Effect": "Allow",
            "Action": "secretsmanager:GetSecretValue",
            "Resource": "*"
        }
    ]
}
```
