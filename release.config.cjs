module.exports = {
  dryRun: false,
  ci: false,
  repositoryUrl: 'https://github.com/Degray84/3d-zephyr.git',
  branches: ['main', { name: 'beta', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
  tagFormat: 'v${version}',
};
