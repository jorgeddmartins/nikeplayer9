# mac only for now

brew install mkcert
mkcert -install
mkcert localhost

# display url to root certificate
# This needs to be send to your iOS device
mkcert -CAROOT

# Let nodejs use this extra CA certificate
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"