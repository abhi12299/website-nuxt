# Portfolio Website using Next.JS

To run this locally, clone this repo and `cd` in the project directory

<ol>
    <li>Create a file secrets.js at the root of the project with the following info:
    <pre>
module.exports = {
    MONGO_URI: 'mongodb://localhost:27017/website',
    REDIS_HOST: '127.0.0.1',
    REDIS_PORT: 6379,
    REDIS_PASSWORD: '',
    OAUTH_CLIENT_ID:
        'google-clientid',
    CLIENT_SECRET: 'google-client-secret',
    JWT_SECRET: 'your jwt secret',
    GMAIL_USER: 'gmail-id',
    GMAIL_PASS: 'gmail-pass',
    ELASTIC_URL: 'localhost:9200'
}
    </pre>
    <small>(* The server uses NodeMailer to send emails to admins!)</small>
    </li>
    <li>
        Make a file <pre>constants/apiKeys.js</pre> with the following contents:
        <pre>module.exports = {
    TINY_MCE_API_KEY: 'your-api-key',
    WIDGETPACK_PLUGIN_ID: 'your-plugin-id',
    GTAG_ID: 'your-google-tag-id'
};</pre>
    </li>
    <li>For the first time execution, run <pre>node init.js</pre></li>
    <li>
    Install packages with
    <pre>yarn</pre>
    </li>
    <li>
    Development server 
    <pre>yarn dev</pre>
    </li>
    <li>
    Production build
    <pre>yarn build</pre>
    </li>
    <li>
    Production server
    <pre>yarn start</pre>
    </li>
    <li>
    Cluster with PM2
    <pre>pm2 start process.json</pre>
    </li>
    <li>
    Reload PM2 (zero downtime updates)
    <pre>pm2 reload process.json</pre>
    </li>
</ol>

## To access dashboard routes,
<small>Assuming the website is running on localhost:3000</small> 
1. Go to https://console.developers.google.com/ and create an OAUTH2 Api key for web. Specify localhost:3000 as authorized origin and localhost:3000/auth/redirect as redirect URI.
2. Copy the client id and secret into <code>secrets.js</code> file.
3. Go to localhost:3000/auth/login and you should be able to login with email that you specified earlier when doing <code>node init.js</code>
