{ pkgs ? import<nixpkgs> {} }: pkgs.mkShell {
  buildInputs = [
    pkgs.bun
    pkgs.nodejs
    pkgs.pkg-config
    pkgs.libsecret
    pkgs.vsce
    pkgs.jq
    pkgs.git
  ];
}